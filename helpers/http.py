import requests
import os

def download(
    url: str, 
    output_path: str,
    force: bool = False
):
    """download url to output_path"""

    if not force and os.path.exists(output_path):
        print(f'download {output_path} from {url} : skipped, already exists')
        return

    print(f'download {output_path} from {url} ...')

    # download to temp file to restart on failure
    output_path_tmp = output_path+".part"
    if force and os.path.exists(output_path_tmp):
        os.unlink(output_path_tmp)

    with requests.get(url, stream=True) as response:
        response.raise_for_status()
        with open(output_path_tmp, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                if chunk:
                    f.write(chunk)
        os.rename(output_path_tmp, output_path)
