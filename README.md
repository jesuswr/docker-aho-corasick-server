Small project to play around with Docker. Will be useful to play with Kubernetes and React next.

To run the server you just need to create a `db/password.txt` file.

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
