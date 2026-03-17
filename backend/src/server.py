from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/post-endpoint', methods=['POST'])
def post_endpoint():
    data = request.get_json()
    return jsonify({"received": data}), 200

@app.route('/get-endpoint', methods=['GET'])
def get_endpoint():
    data = request.get_json(silent=True)
    return jsonify({"received": data}), 200

if __name__ == '__main__':
    app.run(debug=True)