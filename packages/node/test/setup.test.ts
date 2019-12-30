import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import sinonChai from 'sinon-chai'
import chaiHttp from 'chai-http'

chai.use(chaiAsPromised)
chai.use(sinonChai)
chai.use(chaiHttp)
