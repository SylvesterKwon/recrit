import { Injectable } from '@nestjs/common';
import { Neo4jService } from 'nest-neo4j/dist';

/**
 * Service for setting constraints on the Neo4j database.
 */
@Injectable()
export class GraphConstraintService {
  constructor(private neo4jService: Neo4jService) {
    this.setUserIdConstraint();
    this.setComparableIdConstraint('Movie');
  }

  async setUserIdConstraint() {
    console.log('Setting user_id constraint');
    await this.neo4jService.write(
      `CREATE CONSTRAINT user_id IF NOT EXISTS
      FOR (u:User) REQUIRE u.id IS UNIQUE`,
    );
  }

  async setComparableIdConstraint(comparableType: string) {
    console.log(`Setting ${comparableType}_id constraint`);
    await this.neo4jService.write(
      `CREATE CONSTRAINT ${comparableType}_id IF NOT EXISTS
      FOR (c:${comparableType}) REQUIRE c.id IS UNIQUE`,
    );
  }
}
