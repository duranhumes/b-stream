import * as passport from 'passport'

import './passport'

export default passport.authenticate('local', { session: true })
