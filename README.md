I renamed keywords on subscriptions to keyphrases. This means that the cookies will have the wrong variables on them.
To fix this, put the following code after  "users = JSON.parse(usersCookie);" near the top of the services.js file:

   $.each(users, function (index, item) {
      $.each(item.subscriptions, function (index2, sub) {
        sub.keyphrases = [];
      });
    });

refresh the site twice and you should then be able to delete that code.