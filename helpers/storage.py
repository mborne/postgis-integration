import os

HELPERS_DIR=os.path.dirname(__file__)
PROJECT_DIR=os.path.dirname(HELPERS_DIR)

def data_dir() -> str:
    result = os.path.join(PROJECT_DIR)+os.path.sep+"data"
    if not os.path.exists(result):
        os.mkdir(result)
    return result

