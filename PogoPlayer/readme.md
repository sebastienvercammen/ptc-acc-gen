#PokemonGo trainer activator - don't bother to login to accept ToS and pick trainer's name!

Usage guide:

1. Make sure you've latest node.js and npm!
2. Download .zip or clone
3. Run this inside directory: `npm install`
4. Rename `accounts.csv.example` to `accounts.csv`
5. Input data in `accounts.csv` in one of these formats:
  * `auth,username,password,lat,lng,trainerName` (will try to assign trainer name)
  * `auth,username,password,lat,lng` (wont try to assign trainer name)
6. run `node pogo.js`

Todo:

* ??? - send an issue with suggestion!