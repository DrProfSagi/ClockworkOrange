# ClockworkOrange
daylight saving monitoring application built on nodejs


ABOUT
this applicatoin has been built and designed to be used only twice a year, at the night when clocks are moved one hour forward / backward.
As a system administrator I do not have much of programming expiriance, but I can promise this applicaiton is practical.
The application is designed to run as a single windows server, where nodejs, mongodb and npm are installed.
You obviously need administrative privilages on the computer, and prefferably on the domain/s you are managing.
the application utlises a built in utility in windows called w32tm, and by running this command against each server, it compares its own clock against the target server, and if the diffrence is larger then 4.5 minutes, it considers the time to be out of sync.
The application is pretty much self explenatory, but if you have any questions feel free to contact me :)


REQUIREMENTS
1. windows server (I used 2012r2)
2. node js installed
3. mongodb installed
4. database named clockworkorange (all lowercases) on the server
5. port 123 (ntp) open in all firewalls from the monitoring server to the destination servers
6. all servers must be already listening on port 123, in linux it is done by default on most distros, but on windows you need to change a value in the registry (regedit execution script included in utilities folder)
7. the monitoring server time is the one that will be compared against, so make sure it is accurate!


DISCLAIMER
Feel free to use it as much as you wish, but please:
1. Give me some credit, and maybe feedback as i wish to improve
2. I can't stress this enough: USE AS YOUR OWN RISK!!! I will not take any responsibilty to any damage / problems / issues you encoutner while using / in assotion to using my application!
