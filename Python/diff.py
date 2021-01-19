from flask import Flask, request, jsonify
from flask_cors import CORS
import subprocess
import re


app = Flask(__name__)
CORS(app)


@app.route("/diff", methods=['POST'])
def diff():
    data = request.get_json(force=True)
    path = data['repoPath']
    filename = data['fileName']
    cmd = 'git diff ' + filename
    d = subprocess.check_output(cmd, text=True)
	
	# Parse the diff into chunks
	pattern = re.compile(r"@@*\w*(@|$)")
	chunks = re.findall(pattern, d)
	
	chunk_num = 1;
	for chunk in chunks:
		print("Diff chunk " + chunk_num + ":\n")
		print(chunk)
		chunk_num++
	
    print(d)
    return d


if __name__ == "__main__":
    app.run(debug=True)