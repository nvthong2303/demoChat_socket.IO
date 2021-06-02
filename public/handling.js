var socket = io("http://localhost:3001");

socket.on("server-add-fail", () => {
      alert("ten nguoi dung da ton tai");
})

socket.on("server-add-success", (data) => {
      $('#currentuser').html(data);
      $('#loginForm').hide(2000);
      $('#chatForm').show(1000);
})

socket.on("server-send-listUser", (data) => {
      $('#boxContent').html('');
      data.forEach((i) => {
            $('#boxContent').append("<div class='user'>" + i + "</div>")
      })
})

socket.on("server-send-message", (data) => {
      $('#listMessage').append('<div class="message">',data.ten, ":", data.nd, '</div>')
})

socket.on('anyone-typing', (data) => {
      $('#thongbao').html(data);
})

socket.on('anyone-stop-typing', () => {
      $('#thongbao').html('');
})

$(document).ready(() => {
      $('#loginForm').show();
      $('#chatForm').hide();

      $('#txtMessage').focusin(() => {
            socket.emit('user-typing');
      })

      $('#txtMessage').focusout(() => {
            socket.emit('stop-typing');
      })

      $('#btnRegister').click(() => {
            socket.emit('client-add-user', $('#txtUsername').val());
      })

      $('#btnLogout').click(() => {
            socket.emit('client-logout');
            $('#chatForm').hide(2000);
            $('#loginForm').show(1000);
      })

      $('#btnSendMessage').click(() => {
            socket.emit('client-send-message', $('#txtMessage').val());
      })
})

