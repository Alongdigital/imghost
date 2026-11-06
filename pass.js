function unlock() {
  const password = document.getElementById("pass").value;

  if (password === "954082") {
    document.getElementById("message").innerText =
      "Access Granted!";
    window.location.href = "https://alongdigital.github.io/NewPointTesting.com/";
  } else {
    document.getElementById("message").innerText =
      "Incorrect Password!";
  }
}
