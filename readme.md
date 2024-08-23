<div align="center">
  <a href="https://randomuser.bosio.zip">
    <img src="https://i.postimg.cc/tgysSMPJ/logo-hd.png" width="80" height="80">
  </a>

  <h3 align="center">Random User</h3>

  <p align="center">
    A mockup of the original web page with an intuitive generation interface
    <br>
    <a href="https://randomuser.bosio.zip"><strong>Mockup Site</strong></a>
    ·
    <a href="https://randomuser.me"><strong>Original Site</strong></a>
    <br>
    <br>
  </p>
<div style="margin:0px auto; width:200px;">
      <h2>Table of Contents</h2>
      <div><a href="#website">Base Website</a></div>
      <div><a href="#features">Added features</a></div>
      <div><a href="#hw">How it works</a></div>
  <br>
</div>
</div>

<h1 style="text-align:center">PROJECT INFO</h1>
<br>
<div id="website" style="display:flex; flex-direction:column; align-items:center">
  <h2 style="font-size:30px">Base Website</h2>
  <p>This project is a recreation the website <a href="https://randomuser.me">randomuser.me</a> which can be used to generate realistc information about a given number of users.<br>
  My recreation aims at recreating said website adding features such as custom user generation andi improvements to the viewing and management experience. It can be found at <a href="https://randomuser.bosio.zip">randomuser.cf</a></p>
  <h3>Comparison</h3>
  <br>
  <img width="70%" src="https://i.postimg.cc/0NfbL0df/comparison.png">
</div>
<br>
<div id="features" style="display:flex; flex-direction:column; align-items:center">
  <h2 style="font-size:30px">Added Features</h2>
  <p>Addeed features include:</p>
  <br>
  <ul style="display:flex; flex-direction:column; align-items:center">
    <li style="display:flex; flex-direction:column; align-items:center">
      <h2 id="li1">Custom user generation</h2>
      <p>Allows the geration of users while retaining control over number, gender and nationality</p>
      <img src="https://i.postimg.cc/J0y0HVw6/clip-gen.gif" width="60%">
    </li>
    <br><br>
    <li style="display:flex; flex-direction:column; align-items:center">
      <h2 id="li2">User viewing / selection</h2>
      <p>Allows to scroll between the users one by one or by using the integrate selectbox. You can also replace users creatinga a new one on the flight.</p>
      <img src="https://i.postimg.cc/63bTQ6P4/clip-select.gif" width="60%">
    </li>
    <br><br>
    <li style="display:flex; flex-direction:column; align-items:center">
      <h2 id="li3">Custom user management</h2>
      <p>Allow to easily see generated users in a grid as well as reorganizing them freely.</p>
      <img src="https://i.postimg.cc/Zn1Rr74T/clip-grid.gif" width="60%">
    </li>
    <br><br>
  </ul>
  
</div>
<hr>
<div id="hw" style="display:flex; flex-direction:column; align-items:center">
<h2 style="font-size:30px">How It Works</h2>
  <div style="display:flex; justify-content:center">
    <div style="width:25%; text-align:justify; font-size:15px">
      After generation the user using the interface, the parameters are put in a JSON object which is then passed to the requisting function. <br><br>
      A request is created using Ajax with the "GET" type and sent to the randomuser.me API.<br> If the promise if fullfilled and the request is successful, the API returns a page whose contenten is then parsed into a JSON object. <br>If the request fails, an error message is displayed showing the user an error code. <br><br>
      Finally, another function is called to read the content of the object and display it on the page.
    </div>
    <img src="https://i.postimg.cc/7ZSCNk5j/diagram.png" height="400px">
  </div>
<div>