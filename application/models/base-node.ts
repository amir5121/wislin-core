import neo4j, { Driver } from "neo4j-driver"
import { Query, SessionMode } from "neo4j-driver-core/types/types"

const database = process.env.NEO4J_DATABASE || "neo4j"
const driver: Driver = neo4j.driver(
  process.env.NEO4J_DB_CONNECTION_URL || "neo4j://localhost:7687",
  neo4j.auth.basic(
    process.env.NEO4J_USER || "neo4j",
    process.env.NEO4J_PASS || "neo4j"
  )
)

export default class BaseNode {
  private run(defaultAccessMode: SessionMode, cypher: Query, params = {}) {
    const session = driver.session({
      defaultAccessMode,
      database,
    })

    return session
      .run(cypher, params)
      .then((res) => {
        session.close()
        return res
      })
      .catch((e) => {
        session.close()
        throw e
      })
  }

  read(cypher: Query, params = {}) {
    return this.run(neo4j.session.READ, cypher, params)
  }

  write(cypher: Query, params = {}) {
    return this.run(neo4j.session.WRITE, cypher, params)
  }
}
