from flask import Flask, request, jsonify
from src.query import get_insights

app = Flask(__name__)

@app.route('/verify-report', methods=['POST'])
def verify_report():
    data = request.get_json()
    FILE_URL_PARAM = 'file_url'
    if FILE_URL_PARAM not in data:
        return jsonify({"error": "no file url passed in"}), 400
    res = get_insights(data[FILE_URL_PARAM])
    return jsonify(res.model_dump()), 200

@app.route('/', methods=['GET'])
def health_check():
    
    return jsonify({"healthy": True}), 200

if __name__ == '__main__':
    app.run(debug=True)