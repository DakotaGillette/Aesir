### Simple Git Work flow
----
1. clone the repo `git clone https://github.com/DakotaGillette/Aesir.git`
2. in the main folder, run `git pull` to fetch latest code
3. if you're ready to write some new code, you want to do so in a feature branch. here is an example:
    1. to create a new branch and switch to it run `git checkout -b <new branch name here>`
    2. write your code, and commit it with `git commit -am "<your message here>"`
    3. push the code. `git push -u origin <new branch name here>`
    4. now, switch to master branch `git checkout master`
    5. pull the latest master `git pull`
    6. if you are ready to merge your code to master, run `git merge <new branch name here>`

---

#### handling merge conflicts
> ask @r3wt for help