<?php 
    include('connection.php');

    $request_method = strtolower($_SERVER['REQUEST_METHOD']);
    switch($_SERVER['REQUEST_METHOD']){
        case 'POST':
            fetch();
            break;
        case 'GET':
            fetch();
            break;
        case 'PUT':
            save();
            break;
        case 'DELETE':
            destroy();
            break;
    }
    
    function fetch() {
        $x = '0';
        $mysqli = new mysqli(DB_HOST, DB_USER, DB_PASSWORD, DB_DATABASE);
        if (mysqli_connect_errno()) {
            printf("Connect failed: %s\n", mysqli_connect_error());
            exit();
        }
        
        $myData = json_decode(file_get_contents('php://input'));
        $x = $_GET['id'];
        
        $result = $mysqli->query("select *
                                from zipcode
                                where Zipcode = '$x'
                                and LocationType = 'PRIMARY'") or die(mysql_error());
        if($result){
            $json = array();
            while ($row = $result->fetch_array(MYSQLI_NUM)) {
                $json = $row;
            }
            $result->close();
            print json_encode($json);
        } else {
            print "Error!";
        }
    }

?>