<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>

#loader_background{
  /*border: 5px solid red;*/
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  /*background-color: white;*/
  background-color: black;
  
  opacity: 0.8;
  z-index: 2147483646; /*profundidad*/
  }
#loader_container {
  position: absolute;
  /*top: 50%;*/
  /*left: 50%;*/
   top: 40%;
  left: 48%;
   z-index: 2147483647; /*profundidad +1 para quedar ensima*/
}
#loader_animation {
  border: 16px solid #f3f3f3;
  /*border: 16px solid white;*/
  border-radius: 80%;
  /*border-top: 16px solid #3498db;*/
  border-top: 16px solid #93F541;
  -webkit-animation: spin 2s linear infinite; /* Safari */
  animation: spin 2s linear infinite;
  /*background-color: white;*/
  width: 120px;
  height: 120px;
}
#loader_text{
  color: black;
  background-color: white;
  border-radius: 10px;
  border: 3px solid #93F541;
  padding: 5px 10px;
  margin-top: 10px;
}

/* Safari */
@-webkit-keyframes spin {
  0% { -webkit-transform: rotate(0deg); }
  100% { -webkit-transform: rotate(360deg); }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
</head>
<body>
<div id="loader_master_container">
  <div id="loader_background"></div>
  <div id="loader_container">
    <div id="loader_animation"></div>
    <div id="loader_text">Cargando ....</div>
  </div>
</div>
  <script type="text/javascript">
    function showLoader(){
     document.getElementById("loader_master_container").style.visibility = "visible";
    }
    function hideLoader(){
     document.getElementById("loader_master_container").style.visibility = "hidden";
    }
    
    showLoader();
    
  </script>
</body>
</html>
