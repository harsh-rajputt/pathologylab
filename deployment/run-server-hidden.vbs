'' run-server-hidden.vbs
'' Runs the Node.js server completely invisibly — no CMD window.

Dim WshShell
Set WshShell = CreateObject("WScript.Shell")

' Set working directory to the server folder
Dim scriptDir
scriptDir = Replace(WScript.ScriptFullName, WScript.ScriptName, "")
WshShell.CurrentDirectory = scriptDir & "software\server"

' Set production environment so Express serves the React frontend
WshShell.Environment("PROCESS")("NODE_ENV") = "production"

' Run node with window style 0 = completely hidden, False = don't wait
WshShell.Run "node server.js", 0, False

Set WshShell = Nothing

