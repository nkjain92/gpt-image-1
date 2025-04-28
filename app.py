import os
import base64
import uuid
import mimetypes  # Added for explicit MIME type checking
import tempfile  # Added for temporary file handling
from pathlib import Path  # For path manipulation
from flask import Flask, render_template, request, redirect, url_for, flash
from openai import OpenAI
from openai._exceptions import APIConnectionError, AuthenticationError, RateLimitError, OpenAIError, BadRequestError
from dotenv import load_dotenv
from werkzeug.utils import secure_filename # For handling filenames securely

# Load environment variables from .env file
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
app.secret_key = os.getenv('SECRET_KEY', os.urandom(24))

# Define upload and result folders
UPLOAD_FOLDER = os.path.join('static', 'uploads')
RESULTS_FOLDER = os.path.join('static', 'results')
TEMP_FOLDER = os.path.join('static', 'temp')  # For temporary files
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(RESULTS_FOLDER, exist_ok=True)
os.makedirs(TEMP_FOLDER, exist_ok=True)  # Ensure temp folder exists

# Configure allowed extensions (optional but good practice)
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'webp'}

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 25 * 1024 * 1024  # 25 MB limit (as per docs)

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Initialize OpenAI client with explicit API key
try:
    api_key = os.getenv('OPENAI_API_KEY')
    if not api_key:
        raise ValueError("OPENAI_API_KEY environment variable not set.")
    client = OpenAI(api_key=api_key)
    print("OpenAI client initialized successfully.")
except (OpenAIError, ValueError) as e:
    print(f"Error initializing OpenAI client: {e}")
    client = None

@app.route('/', methods=['GET'])
def index():
    """
    Renders the main page.
    Displays the result image if its URL is provided.
    """
    result_image_url = request.args.get('result_image_url')
    return render_template('index.html', result_image_url=result_image_url)

@app.route('/process', methods=['POST'])
def process_image():
    """
    Handles image generation and editing based on selected mode.
    """
    if client is None:
        flash("OpenAI client is not initialized. Check API key and logs.", "error")
        return redirect(url_for('index'))

    # --- Common Data --- #
    mode = request.form.get('mode')
    prompt = request.form.get('prompt')
    size = request.form.get('size', '1024x1024')

    if not prompt:
        flash("Prompt is required for all modes.", "warning")
        return redirect(url_for('index'))

    # Create a unique subfolder for this request's temporary files
    temp_dir = os.path.join(TEMP_FOLDER, str(uuid.uuid4()))
    os.makedirs(temp_dir, exist_ok=True)
    print(f"Created temporary directory: {temp_dir}")

    try:
        result_data = None

        # --- Mode-Specific Logic --- #
        if mode == 'generate':
            quality = request.form.get('quality', 'standard')
            background = request.form.get('background', 'opaque')

            api_params = {
                "model": "gpt-image-1",
                "prompt": prompt,
                "n": 1,
                "size": size,
                "response_format": "b64_json"
            }
            if quality != 'standard':
                api_params['quality'] = quality
            if background == 'transparent':
                api_params['background'] = 'transparent'

            print(f"Calling OpenAI generate with params: {api_params}")
            result = client.images.generate(**api_params)
            result_data = result.data[0]

        elif mode == 'edit_reference':
            reference_files = request.files.getlist('reference_images')
            if not reference_files or all(f.filename == '' for f in reference_files):
                flash("Reference image(s) are required for this mode.", "warning")
                return redirect(url_for('index'))

            # Supported MIME types
            supported_mimetypes = ['image/jpeg', 'image/png', 'image/webp']
            temp_paths = []  # Store paths to temporary files
            file_handles = []  # Store open file handles

            for file in reference_files:
                if file and file.filename:
                    # Guess the MIME type based on the file extension
                    mime_type, _ = mimetypes.guess_type(file.filename)
                    print(f"File: {file.filename}, Guessed MIME type: {mime_type}")

                    if mime_type not in supported_mimetypes:
                        flash(f"Unsupported MIME type for file: {file.filename}", "error")
                        return redirect(url_for('index'))

                    # Save the file to a temporary location with correct extension
                    ext = os.path.splitext(file.filename)[1]
                    temp_path = os.path.join(temp_dir, f"ref_{len(temp_paths)}{ext}")
                    file.save(temp_path)
                    temp_paths.append(temp_path)

                    # Open the file in binary mode, mimicking the docs example
                    file_handle = open(temp_path, 'rb')
                    file_handles.append(file_handle)

                    print(f"Saved and opened temporary file: {temp_path}")

                elif file.filename != '':
                    flash(f"Invalid file: {file.filename}", "error")
                    return redirect(url_for('index'))

            if not temp_paths:
                flash("No valid reference images provided.", "warning")
                return redirect(url_for('index'))

            try:
                api_params = {
                    "model": "gpt-image-1",
                    "image": file_handles,  # Pass list of open file handles
                    "prompt": prompt,
                    "n": 1,
                    "size": size,
                }
                print(f"Calling OpenAI edit (reference) with {len(file_handles)} file handles")
                result = client.images.edit(**api_params)
                result_data = result.data[0]
            finally:
                # Close all file handles
                for handle in file_handles:
                    handle.close()

        elif mode == 'edit_inpainting':
            image_file = request.files.get('inpainting_image')
            mask_file = request.files.get('inpainting_mask')

            if not image_file or image_file.filename == '' or \
               not mask_file or mask_file.filename == '':
                flash("Both image and mask files are required for inpainting.", "warning")
                return redirect(url_for('index'))

            # Check MIME types
            image_mime, _ = mimetypes.guess_type(image_file.filename)
            mask_mime, _ = mimetypes.guess_type(mask_file.filename)

            print(f"Image file: {image_file.filename}, Guessed MIME type: {image_mime}")
            print(f"Mask file: {mask_file.filename}, Guessed MIME type: {mask_mime}")

            if image_mime not in ['image/jpeg', 'image/png', 'image/webp']:
                flash(f"Unsupported MIME type for image: {image_file.filename}", "error")
                return redirect(url_for('index'))

            if mask_mime != 'image/png':
                flash("Mask file must be a PNG image with transparency.", "error")
                return redirect(url_for('index'))

            # Save files to temporary location
            image_ext = os.path.splitext(image_file.filename)[1]
            mask_ext = os.path.splitext(mask_file.filename)[1]

            temp_image_path = os.path.join(temp_dir, f"inpaint_image{image_ext}")
            temp_mask_path = os.path.join(temp_dir, f"inpaint_mask{mask_ext}")

            image_file.save(temp_image_path)
            mask_file.save(temp_mask_path)

            print(f"Saved temporary image: {temp_image_path}")
            print(f"Saved temporary mask: {temp_mask_path}")

            # Open files in binary mode
            image_handle = open(temp_image_path, 'rb')
            mask_handle = open(temp_mask_path, 'rb')

            try:
                api_params = {
                    "model": "gpt-image-1",
                    "image": image_handle,  # Pass open file handle
                    "mask": mask_handle,    # Pass open file handle
                    "prompt": prompt,
                    "n": 1,
                    "size": size,
                }
                print("Calling OpenAI edit (inpainting) using file handles")
                flash("Inpainting initiated.", "info")
                result = client.images.edit(**api_params)
                result_data = result.data[0]
            finally:
                # Close file handles
                image_handle.close()
                mask_handle.close()

        else:
            flash(f"Invalid mode selected: {mode}", "error")
            return redirect(url_for('index'))

        # --- Process Result --- #
        if not result_data or not hasattr(result_data, 'b64_json') or not result_data.b64_json:
            flash("API returned empty image data.", "error")
            return redirect(url_for('index'))

        image_base64 = result_data.b64_json
        image_bytes = base64.b64decode(image_base64)
        filename = f"{uuid.uuid4()}.png"
        filepath = os.path.join(RESULTS_FOLDER, filename)

        with open(filepath, "wb") as f:
            f.write(image_bytes)
        print(f"Result image saved to {filepath}")

        image_url = url_for('static', filename=f'results/{filename}')
        flash("Image processed successfully!", "success")
        return redirect(url_for('index', result_image_url=image_url))

    # --- Error Handling --- #
    except AuthenticationError:
        flash("Authentication failed. Check your OpenAI API key.", "error")
        print("OpenAI Error: Authentication failed")
    except RateLimitError:
        flash("Rate limit exceeded. Please wait and try again.", "error")
        print("OpenAI Error: Rate limit exceeded")
    except APIConnectionError:
        flash("Failed to connect to OpenAI servers. Check network.", "error")
        print("OpenAI Error: Connection error")
    except BadRequestError as e:
        error_message = f"API request error: {str(e)}"
        flash(error_message, "error")
        print(f"OpenAI BadRequestError: {e}")
    except OpenAIError as e:
        error_message = f"OpenAI API error: {str(e)}"
        flash(error_message, "error")
        print(f"OpenAI Error: {e}")
    except Exception as e:
        error_message = f"An unexpected error occurred: {str(e)}"
        flash(error_message, "error")
        print(f"Unexpected Error: {e}")
    finally:
        # Clean up temporary files
        import shutil
        try:
            if os.path.exists(temp_dir):
                shutil.rmtree(temp_dir)
                print(f"Cleaned up temporary directory: {temp_dir}")
        except Exception as e:
            print(f"Error cleaning up temporary files: {e}")

    return redirect(url_for('index'))

if __name__ == '__main__':
    app.run(debug=True, host='127.0.0.1', port=5000)
