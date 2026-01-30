import os
from dotenv import load_dotenv

load_dotenv()

PGHOST = os.getenv('PGHOST')
PGPORT = os.getenv('PGPORT')
PGDATABASE = os.getenv('PGDATABASE')
PGUSER = os.getenv('PGUSER')
PGPASSWORD = os.getenv('PGPASSWORD')

def show():
    print(f'PGHOST={PGHOST}')
    print(f'PGPORT={PGPORT}')
    print(f'PGDATABASE={PGDATABASE}')
    print(f'PGUSER={PGUSER}')
    print(f'PGPASSWORD=*******')

def os_env():
    return os.environ.copy()

if __name__ == '__main__':
    show()

