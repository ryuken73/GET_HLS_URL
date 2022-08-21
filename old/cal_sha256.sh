contentJS=`cat ./content.js`
echo -n "$contentJS"|openssl sha256 -binary|openssl base64

#  unsafe-inline 'self' 'sha256-Bdi63Bc1HwFCVL3Js71Bi/EV4W1Koch8bREKlB90Lgk='"