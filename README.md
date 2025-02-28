Small project to play around with Docker. Will be useful to play with Kubernetes and React next.

<img width="501" alt="image" src="https://github.com/user-attachments/assets/53bfd333-0373-4f79-8fb3-49347031220c" />

To run the server you just need to create a `db/password.txt` file and run `docker compuse up --build`, this will launch a postgresql database, a server to make requests to and a frontend to play with. The `/backend/src/` directory is mounted to the container so it reloads the server when you make changes to it, same as `/frontend/src/`.

Then you can start sending requests to the server like:

Adding a word.
```
curl -X POST http://localhost:8000/insert -H "Content-Type: application/json" -d '{"word": "Hello"}'
```

Listing all words.
```
curl -X GET http://localhost:8000/words -H "Content-Type: application/json"
```

Deleting a word.
```
curl -X DELETE http://localhost:8000/delete -H "Content-Type: application/json" -d '{"word":"hello"}'
```

Or the most interesting thing, querying how many times each word is found in a given text (aho-corasick algorithm).
```
curl -X POST http://localhost:8000/query -H "Content-Type: application/json" -d '{"text": "Hello how are you"}'
```


