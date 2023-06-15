# Embed static files into binary and serve as webserver.

Add your app files to "static" directory and it will be embedded to to binary and served with a web server.

### Available options:
```
  --help 
      show help
  --directory string
    	directory to serve files from (default ".")
  --port int
    	web server port (default 8765)
```

### Compile binaries for all architectures:
```
sh scripts/crosscompile.sh
```

