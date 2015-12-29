This is an experimental app to test a potential architecture for scalable realtime applications using React, Redux, WebSockets, and RethinkDB.

With [RethinkDB changefeeds](https://rethinkdb.com/docs/changefeeds/javascript/) and WebSockets we can extend the unidirectional data flow of Redux all the way back to the database.

![](https://github.com/cschram/chat-experiment/raw/master/data-flow.png)
