iNews - News Aggregator
=======================

Copyright 2013 - Fabian Vogelsteller

License:
MIT License


iNews is news aggregator, which i wrote as part of my Master Thesis.
Currently it's an interface prototype and there is not much analysis done on the backend.

The data is coming from the newscred.com API, using the test-key.
In future releases articles will be fetched from a variety of different sources and will be analyzed, based on pro/con and opinion strength.

You can contact me at fabian@frozeman.de
If you like it and want to work on it as well, please get in touch with me :)


Run it locally
------------

Clone the repository to your local machine and install meteorjs
(http://meteor.com) by typing the follwoing command into the terminal:

    $ curl https://install.meteor.com | sh


Additional you have to install meteorite the meteor package manager using the follwing command (you need to install NPM [Node Package Manager] first)

    $ npm install -g meteorite

After both is installed you can change to the folder of the iNews App and edit the smart.json file, by fixing the path of the „inews-analysis“ package.
(replace „/Users/frozeman/Development/Server/iNews/“ with your local path)

After that run the follwing command inside the iNew App folder:

    $ mrt update

And then start the local server by typing

    $ mrt

Then you can open your browser and navigate to:
http://localhost:3000