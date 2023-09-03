function handleWindowLoad() {
  const storedUsername = localStorage.getItem("rememberedUsername");
  const storedPassword = localStorage.getItem("rememberedPassword");

  if (storedUsername && storedPassword) {
    document.querySelector('input[name="docu"]').value = storedUsername;
    document.querySelector('input[name="pass"]').value = storedPassword;
    document.querySelector('input[name="remember-me"]').checked = true;
  }
}

window.addEventListener("load", handleWindowLoad); //validar si existe el usuario

//recorrer la informacion del endpoint y validar usuario con login modal
function createRoomElement(habitacion2) {
  const nuevoDiv = document.createElement("div");
  nuevoDiv.classList.add(`col-md-12`);
  const opciones = { style: "currency", currency: "COP" };
  const precio = habitacion2.precio_habita.toLocaleString(opciones);
  console.log(habitacion2.tipo_habitacion);
  nuevoDiv.innerHTML = `
        <div class="col-md-12">
            <div class="row">
                <div class="col-md-3">
                    <div class="room-img">
                        <div class="box12">
                            <img src="img/room/room-1.jpg">
                            <div class="box-content">
                                <h3 class="title">${habitacion2.tipo_habitacion}</h3>
                                <ul class="icon">
                                    <li><a href="#" data-toggle="modal" data-target="#modal-id"><i
                                                class="fa fa-link"></i></a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="room-des">
                        <h3><a href="#" data-toggle="modal"
                                data-target="#modal-id">Habitacion ${habitacion2.tipo_habitacion}</a></h3>
                        <p>${habitacion2.num_habitacion}</p>
                        <ul class="room-size">
                            <li><i class="fa fa-arrow-right"></i>Tamaño: 260 pies cuadrados </li>
                            <li><i class="fa fa-arrow-right"></i>Camas: ${habitacion2.num_camas} </li>
                        </ul>
                        <ul class="room-icon">
                            <li class="icon-2" title="Aire acondicionado"></li>
                            <li class="icon-3" title="Baño privado"></li>
                            <li class="icon-4" title="Acceso a ducha"></li>
                            <li class="icon-5" title="Punto de secado"></li>
                            <li class="icon-6" title="Televisión"></li>
                            <li class="icon-7" title="Wifi"></li>
                            <li class="icon-8" title="Teléfono"></li>
                            <li class="icon-9" title="Minibar"></li>
                            <li class="icon-10" title="Cocina"></li>
                        </ul>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="room-rate">
                        <h3>Desde</h3>
                        <h6>COP&nbsp;${precio}</h6>
                        <a class="openModalBtn" type="submit">Reservar ahora</a>
                    </div>
                </div>
            </div>
        </div>
        <hr>
    `;

  const htmlElement = document.querySelector(".rws");
  htmlElement.appendChild(nuevoDiv);
  handleReservaClick();
}

function handleReservaClick() {
  const openModalBtns = document.querySelectorAll(".openModalBtn");
  openModalBtns.forEach((openModalBtn) => {
    openModalBtn.addEventListener("click", () => {
      // Aquí puedes mostrar el modal o realizar la acción deseada al hacer clic en el botón
      const modal = document.getElementById("login-modal");
      const closeModalBtn = document.querySelector(".close");

      modal.style.display = "block";

      closeModalBtn.addEventListener("click", function () {
        modal.style.display = "none";
      });

      window.addEventListener("click", function (event) {
        if (event.target === modal) {
          modal.style.display = "none";
        }
      });

      document
        .getElementById("login-button")
        .addEventListener("click", async function (event) {
          event.preventDefault();
          const rememberMeCheckbox = document.querySelector(
            'input[name="remember-me"]'
          );
          if (rememberMeCheckbox.checked) {
            localStorage.setItem(
              "rememberedUsername",
              document.querySelector('input[name="docu"]').value
            );
            localStorage.setItem(
              "rememberedPassword",
              document.querySelector('input[name="pass"]').value
            );
          }

          const documento = document.querySelector('input[name="docu"]').value;
          const password = document.querySelector('input[name="pass"]').value;

          if (!documento || !password) {
            alert("Faltan datos");
          } else {
            const data = {
              num_cedula: documento,
              pass: password,
            };

            try {
              const response = await fetch("http://localhost:4000/validate", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
              });

              const responseData = await response.json();

              if (responseData.ok && responseData.result.success) {
                // Login successful
                alert("Login successful: " + responseData.result.message);
              } else {
                // Login failed
                alert("Login failed");
              }
            } catch (error) {
              console.error("Error:", error);
              alert("An error occurred");
            }
          }
        });
    });
  });
}

function fetchAndCreateRooms() {
  fetch("http://localhost:4000/productos")
    .then((response) => response.json())
    .then((result) => {
      const habitaciones = result.result;
      const habitacion = habitaciones[0];
      for (let i = 0; i < habitaciones[0].length; i++) {
        const habitacion2 = habitacion[i];
        createRoomElement(habitacion2);
      }
    })
    .catch((error) => {
      console.error("Error al obtener datos de la API:", error);
    });
}

document.addEventListener("DOMContentLoaded", fetchAndCreateRooms); //extraer habitaciones/productos disponibles
