- Setup slave
```mysql
CHANGE MASTER TO
MASTER_HOST='172.20.0.2',
MASTER_PORT=3306,
MASTER_USER='root',
MASTER_PASSWORD='thangvb',
master_log_file='mysql-bin.000011',
master_log_pos=157,
master_connect_retry=60,
GET_MASTER_PUBLIC_KEY=1;
```

