from flask import Flask, request, jsonify
from flask_cors import CORS
import subprocess

app = Flask(__name__)
CORS(app)  # Enable CORS

@app.route('/run_speed_test', methods=['POST'])
def run_speed_test():
    data = request.get_json()
    file_path = data.get('filePath')
    data_size = data.get('dataSize')
    buffer_size = data.get('bufferSize')

    if not file_path or not data_size or not buffer_size:
        return jsonify({'error': 'File path is required'}), 400

    try:
        result = subprocess.run(['./speed_test', file_path, str(data_size), str(buffer_size)], capture_output=True, text=True, check=True)

        lines = result.stdout.split('\n')
        write_speed = lines[0].strip()
        write_latency = lines[1].strip()
        read_speed = lines[2].strip()
        read_latency = lines[3].strip()

        return jsonify({
            'writeSpeed': write_speed,
            'writeLatency': write_latency,
            'readSpeed': read_speed,
            'readLatency': read_latency
        })
    except subprocess.CalledProcessError as e:
        print(f"Error running subprocess: {e}")
        return jsonify({'error': 'Failed to run speed test'}), 500
    except Exception as e:
        print(f"Unexpected error: {e}")
        return jsonify({'error': 'An unexpected error occurred'}), 500

if __name__ == '__main__':
    app.run(debug=True)
