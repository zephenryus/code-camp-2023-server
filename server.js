const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const copy = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis lorem leo, finibus non luctus et, consectetur vel lorem. Curabitur condimentum ultricies quam. Etiam quis ex risus. Nulla auctor a sem quis ultrices. Pellentesque congue ipsum ligula, eget convallis magna interdum finibus. Aliquam erat volutpat. Suspendisse porta ipsum vitae tincidunt convallis. Cras consectetur quam venenatis risus volutpat dapibus. In interdum id neque sit amet interdum. Mauris eget gravida dui, dictum posuere urna. Donec porta lacus est, et gravida turpis imperdiet semper. Pellentesque et metus maximus sem semper efficitur. Maecenas ultricies dui varius, mattis elit bibendum, volutpat eros. Aliquam placerat laoreet sapien, sit amet mattis felis consectetur ut. Aenean elit libero, malesuada in dapibus ac, ullamcorper nec odio. Donec vitae lorem aliquet, rhoncus justo ut, gravida magna. Pellentesque ullamcorper ultricies elit, eget aliquet lectus egestas fringilla. Curabitur laoreet libero id molestie interdum. Vestibulum sagittis et orci nec euismod. Cras blandit, elit at bibendum eleifend, erat libero egestas purus, nec egestas nunc risus in mi. Aliquam porttitor lorem sit amet aliquet molestie. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Donec ante turpis, luctus tincidunt commodo id, dapibus eu urna. Donec non nisl ut tortor egestas blandit. Suspendisse vestibulum sed magna in cursus. Aliquam quis dui nisl. Nunc varius laoreet diam, id posuere libero tincidunt quis. Duis dignissim vestibulum facilisis. Proin sed mauris maximus, venenatis purus convallis, accumsan leo. Nam rutrum rutrum felis eu aliquam. Sed interdum ipsum in erat tristique, vel lacinia justo pellentesque. Sed pellentesque, mi sed molestie dapibus, metus nisl fringilla nulla, vitae convallis nunc sapien eget lacus. Quisque vel neque vitae ex commodo cursus congue ut erat. Vivamus in nunc eleifend, pulvinar nisi a, elementum leo. Praesent in convallis justo, sed malesuada arcu. Vestibulum quis viverra ex. Nulla facilisi. Curabitur nec porta odio. Proin porta urna ut magna ornare volutpat. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Fusce at ipsum sagittis, euismod nibh iaculis, feugiat dui. Aliquam sed fermentum ipsum. Nunc efficitur varius eros, a tempus diam dapibus ac. Nam elementum dui ac ultrices blandit. Vivamus non magna laoreet, ultrices lacus in, fermentum dolor. Etiam ut sem ac ante dapibus pretium. Etiam quis libero in mauris imperdiet tempor eget ac urna. Maecenas sagittis aliquam ex, in lobortis dolor consectetur sed. Proin suscipit odio eget vulputate condimentum. Nullam vitae sem euismod, malesuada mauris eget, scelerisque ante. Morbi ac velit tortor. Aliquam velit tellus, porta id orci vel, imperdiet auctor mauris. Fusce eros dolor, varius vitae elit eu, porta luctus ex. Duis condimentum sodales bibendum. Phasellus ut massa ornare, ultricies velit eget, viverra lorem. Curabitur eu sapien sem. Suspendisse sit amet nulla sit amet lorem mollis tempus. Praesent non mauris in magna posuere volutpat. Curabitur porttitor tellus lorem, eget euismod magna tincidunt a. Aliquam sit amet facilisis velit. Praesent gravida elementum orci, id pulvinar elit scelerisque in. Quisque a consequat ligula, ac semper diam. Nullam tincidunt varius mi in eleifend. Nam ac nunc quis sem dictum ultrices. Aliquam justo tortor, consectetur a tristique eget, scelerisque ac turpis. Donec porta mauris eget justo. ";
const copyArray = copy.split(". ").map((val) => val.trim());

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:4200",
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('chat message', (msg) => {
    console.log('message started');
    const sentence = copyArray[Math.floor(Math.random() * copyArray.length)] + ".";
    const words = sentence.split(/\s/);
    setTimeout(async () => {
      for (const word of words) {
        const index = words.indexOf(word);
        await new Promise(done => setTimeout(() => done(), Math.floor(Math.random() * 200) + 50));
        io.emit('chat message', word);

        if (index === words.length - 1) {
          await new Promise(done => setTimeout(() => done(), Math.floor(Math.random() * 100) + 100));
          console.log('message complete');
          io.emit('message complete');
        }
      }
    }, 2000);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});
