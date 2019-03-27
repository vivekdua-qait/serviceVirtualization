

In order to run the tests, you will need to download at least the ChromeDriver and put it into your path.
I have included a webdrivers folder in this repo, that you can simply copy into your Applications folder and then edit your .bash_profile to add
export PATH="/Applications/webdrivers:$PATH"
to get going. (Note: there are also some files for setting running a Selenium Grid that isn't covered by this readme)

  $ npm install

 $ npm run test

Todo: Create an example of a driver class to allow easy switching and upload to github


