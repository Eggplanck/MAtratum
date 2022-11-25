#import multiprocessing

bind = "0.0.0.0:8000"
workers = 1#multiprocessing.cpu_count()*2+1
threads = 8
timeout = 0