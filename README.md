[![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-c66648af7eb3fe8bc4f294546bfd86ef473780cde1dea487d3c4ff354943c9ae.svg)](https://classroom.github.com/online_ide?assignment_repo_id=7654907&assignment_repo_type=AssignmentRepo)
# Mars Mission Photos
Mars photos search egine with login system and saved images database

<h1>Gal Malka</h1>
<p>Email: galma@edu.hac.ac.il</p>

<h1>Initialization</h1>
<p>
Open console, execute : npm install
</p>

<h1>Execution</h1>
<p>Use the configuration in Webstorm (top right 'play' button) or: open terminal,
and execute : "npm install", "npx sequelize-cli db:migrate", "node bin/www" </p>
<p>
Then open your browser at http://localhost:3000
</p>

<h1>Assumptions</h1>
<p>
  
</p>

<h1>Notes</h1>
<p>
implemented a home page as landing page instead of login page.
</p>
<p>
login / register / sign out system is implemented in navbar. when user has logged in
hes mail shown in the right navbar. then he can press on the mail to open modal information
which includes the mail, full name and sign out button.
</p>
<p>
failure to fetch from nasa's server will prevent showing the search form until problem fixed
</p>
