import { Injectable, NotImplementedException } from '@nestjs/common';
import { Neo4jService } from 'nest-neo4j/dist';
import { User } from 'src/user/entities/user.entity';

/**
 * Neo4j Graph Database Repository
 * It wraps the Neo4jService from nest-neo4j package.
 */
@Injectable()
export class GraphRepository {
  constructor(private neo4jService: Neo4jService) {}

  async upsertComparableNode(
    comparableType: string,
    id: number,
    title?: string,
  ) {
    const sameComparableNodeCountQueryResult = await this.neo4jService.read(
      `MATCH (c:${comparableType} {id: ${id}})
      RETURN count(c) AS comparableCount`,
    );

    const sameComparableNodeCount =
      sameComparableNodeCountQueryResult.records[0].get('comparableCount');

    if (sameComparableNodeCount === 0) {
      await this.neo4jService.write(
        `CREATE (c:${comparableType} {id: ${id}, title: "${title}"})
        RETURN c`,
      );
    }
  }

  async createUserNode(user: User) {
    await this.neo4jService.write(
      `CREATE (u:User {id: ${user.id}, username: "${user.username}"})
      RETURN u`,
    );
  }

  async deleteUserNode(user: User) {
    await this.neo4jService.write(
      `MATCH (u:User {id: ${user.id}})
      DELETE u`,
    );
  }

  async createComparison() {
    throw new NotImplementedException();
  }

  async getAllComparisonByUserId() {
    throw new NotImplementedException();
  }

  async setComparableAsConsumed() {
    throw new NotImplementedException();
  }

  async getAllConsumedComparableByUserId() {
    throw new NotImplementedException();
  }
}
