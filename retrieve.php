<?php
	
  // The below code retrieves the contents of the products table from the galway_gadgets database (which can be imported into
  // XAMPP with the provided galway_gadgets.sql file), arranging the results in a HTML table.

  //Step 1:  Create a database connection
  $dbhost = "localhost";
  $dbuser = "root";
  $dbpassword = "";
  $dbname = "galway_gadgets";  

  $connection = mysqli_connect($dbhost,$dbuser,$dbpassword,$dbname);
  
  //Test if the connection occoured
  if(mysqli_connect_errno()){
    die("DB connection failed: " .
      mysqli_connect_error() .
        " (" . mysqli_connect_errno() . ")"
        );
  }

  if (!$connection)
    {
      die('Could not connect: ' . mysqli_error());
    }
  
  //Step 2: Perform the query to retrieve all data from the products table

  $result = mysqli_query($connection,"SELECT * FROM products");  
  
  //Step 3: Return the database data and arrange it in a HTML table
  echo "<table border='1' id='myTable'>
  <tr>
  <th>ID</th>
  <th>Name</th>
  <th>Price</th>
  <th>Rating</th>
  <th>Number of Reviews</th>
  </tr>";
  
  while($row = mysqli_fetch_array($result))
  {
    echo "<tr>";
    echo "<td>" . $row['id'] . "</td>";
    echo "<td>" . $row['name'] . "</td>";
    echo "<td>" . $row['price'] ."</td>";
    echo "<td>" . $row['rating'] ."</td>";
    echo "<td>" . $row['number_of_reviews'] ."</td>";
    echo "</tr>";
  }
  
  echo "</table>";
  
  // Step 4:  Release the returned data 
  mysqli_free_result($result);
  
  // Step 5:  Close the database connection
  mysqli_close($connection);
  
?>