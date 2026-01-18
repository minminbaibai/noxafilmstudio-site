from flask import Flask, request, jsonify, send_from_directory
import os
import logging

app = Flask(__name__, static_folder='static')

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Email configuration
RECIPIENT_EMAIL = "contact@noxafilmstudio.com"
UPLOAD_FOLDER = '/tmp/uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route('/')
def index():
    return app.send_static_file('index.html')

@app.route('/css/<path:path>')
def send_css(path):
    return send_from_directory('static/css', path)

@app.route('/images/<path:path>')
def send_images(path):
    return send_from_directory('static/images', path)

@app.route('/submit-application', methods=['POST'])
def submit_application():
    try:
        # Extract form data
        name = request.form.get('name', 'Not provided')
        email = request.form.get('email', 'Not provided')
        location = request.form.get('location', 'Not provided')
        portfolio = request.form.get('portfolio', 'Not provided')
        experience = request.form.get('experience', 'Not provided')
        directed = request.form.get('directed', 'Not provided')
        vision = request.form.get('vision', 'Not provided')
        motivation = request.form.get('motivation', 'Not provided')
        social = request.form.get('social', 'Not provided')
        
        # Build email content
        email_body = f"""
        <html>
        <head>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                h1 {{ color: #333; }}
                .field {{ margin-bottom: 15px; }}
                .label {{ font-weight: bold; }}
            </style>
        </head>
        <body>
            <div class="container">
                <h1>New Director Application</h1>
                <div class="field">
                    <p class="label">Full Name:</p>
                    <p>{name}</p>
                </div>
                <div class="field">
                    <p class="label">Email Address:</p>
                    <p>{email}</p>
                </div>
                <div class="field">
                    <p class="label">Country / City:</p>
                    <p>{location}</p>
                </div>
                <div class="field">
                    <p class="label">Portfolio / Website:</p>
                    <p>{portfolio}</p>
                </div>
                <div class="field">
                    <p class="label">Directing Experience:</p>
                    <p>{experience}</p>
                </div>
                <div class="field">
                    <p class="label">Has Directed a Film Before:</p>
                    <p>{directed}</p>
                </div>
                <div class="field">
                    <p class="label">Visual Style / Directing Vision:</p>
                    <p>{vision}</p>
                </div>
                <div class="field">
                    <p class="label">Motivation to Work with Noxa Film:</p>
                    <p>{motivation}</p>
                </div>
                <div class="field">
                    <p class="label">Social Media / IMDb / LinkedIn:</p>
                    <p>{social}</p>
                </div>
            </div>
        </body>
        </html>
        """
        
        # Handle file upload if present
        file_info = None
        if 'sample' in request.files:
            file = request.files['sample']
            if file.filename != '':
                filename = file.filename
                file_path = os.path.join(UPLOAD_FOLDER, filename)
                file.save(file_path)
                file_info = {
                    'filename': filename,
                    'path': file_path
                }
        
        # Log submission for demonstration
        logger.info(f"Application received from: {name} ({email})")
        logger.info(f"Would send email to: {RECIPIENT_EMAIL}")
        
        # In a real implementation, you would send an email here
        # For demonstration, we'll just log the attempt
        
        # Return success response
        return jsonify({
            'success': True,
            'message': 'Application submitted successfully. Thank you!'
        })
        
    except Exception as e:
        logger.error(f"Error processing application: {str(e)}")
        return jsonify({
            'success': False,
            'message': f'Error processing your application: {str(e)}'
        }), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
