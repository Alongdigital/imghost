function unlock() {
  const password = document.getElementById("pass").value;

  if (password === "9540823706") {
    document.getElementById("message").innerText =
      "Access Granted!";
    window.location.href = "https://www.edudel.nic.in/";
  } else {
    document.getElementById("message").innerText =
      "Incorrect Password!";
  }
}
