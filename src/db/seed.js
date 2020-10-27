const { execSync } = require( 'child_process' );
const path = require( 'path' );

function seed() {
    try {
        execSync( `mongoimport --db calendar-app --collection users --drop --file ${path.join( __dirname, '..', 'data', 'users.json' )} --jsonArray` );
        execSync( `mongoimport --db calendar-app --collection meetings --drop --file ${path.join( __dirname, '..', 'data', 'meetings.json' )} --jsonArray` );
        execSync( `mongoimport --db calendar-app --collection teams --drop --file ${path.join( __dirname, '..', 'data', 'teams.json' )} --jsonArray` );
    } catch( error ) {
        console.error( `Documents could not be imported be imported` );
    }
}

module.exports = {
    seed
};