from flask import Flask, request
import subprocess


app = Flask(__name__)

@app.route("/diff", methods=['POST'])
def diff():
    data = request.get_json(force=True)
    filename = data["filename"]
    cmd = 'git diff ' + filename
    d = subprocess.check_output(cmd, text=True)
    return d


if __name__ == "__main__":
    app.run(debug=True)