exist = `mysql -u root -p  -h localhost -P 3306 -e "show databases linke danielTest"`

if [ -z $exist ]
then 
    echo "existe"
else
    echo "no existe"
fi