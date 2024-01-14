import { Injectable, NotImplementedException } from '@nestjs/common';
import { Neo4jService } from 'nest-neo4j/dist';
import { ComparableType } from 'src/comparable/types/comparable.types';
import {
  Comparison,
  ComparisonVerdict,
} from 'src/comparison/entities/comparison.entity';
import { User } from 'src/user/entities/user.entity';

/**
 * Neo4j Graph Database Repository
 * It wraps the Neo4jService from nest-neo4j package.
 */
@Injectable()
export class GraphRepository {
  constructor(private neo4jService: Neo4jService) {}

  async upsertComparable(
    comparableType: ComparableType,
    id: number,
    title?: string,
  ) {
    await this.neo4jService.write(
      `MERGE (c:${comparableType} {id: ${id}})
      SET c.title = "${title}"
      RETURN c`,
    );
  }

  async createUserNode(user: User) {
    await this.neo4jService.write(
      `CREATE (u:user {id: ${user.id}, username: "${user.username}"})
      RETURN u`,
    );
  }

  async deleteUserNode(user: User) {
    await this.neo4jService.write(
      `MATCH (u:user {id: ${user.id}})
      DELETE u`,
    );
  }

  /**
   * Add comparison edge to graph, all redundant comparison edges will be removed.
   */
  async upsertComparison(comparison: Comparison) {
    const firstComparableNode = `(c1:${comparison.comparableType} {id: ${comparison.firstItemId}})`;
    const secondComparableNode = `(c2:${comparison.comparableType} {id: ${comparison.secondItemId}})`;
    const userId = comparison.user.id;

    await this.neo4jService.write(`
      MATCH ${firstComparableNode}, ${secondComparableNode}
      OPTIONAL MATCH (c1)-[cmp:BETTER_THAN {user_id: ${userId}}]-(c2)
      DELETE cmp
      ${
        comparison.verdict === ComparisonVerdict.EQUAL
          ? `MERGE (c2)-[:BETTER_THAN {user_id: ${userId}}]->(c1), (c1)-[:BETTER_THAN {user_id: ${userId}}]->(c2)` // equal
          : comparison.verdict === ComparisonVerdict.FIRST
            ? `MERGE (c2)-[:BETTER_THAN {user_id: ${userId}}]->(c1)` // first
            : `MERGE (c1)-[:BETTER_THAN {user_id: ${userId}}]->(c2)` // second
      }
    `);
  }

  async upsertConsume(user: User, comparableType: ComparableType, id: number) {
    const comparableNode = `(c:${comparableType} {id: ${id}})`;
    const userNode = `(u:user {id: ${user.id}})`;
    await this.neo4jService.write(`
      MATCH ${comparableNode}, ${userNode}
      MERGE (u)-[:CONSUMED]->(c)
    `);
  }

  async deleteConsume(user: User, comparableType: ComparableType, id: number) {
    const comparableNode = `(c:${comparableType} {id: ${id}})`;
    const userNode = `(u:user {id: ${user.id}})`;
    await this.neo4jService.write(`
      MATCH ${userNode}-[consumed:CONSUMED]->${comparableNode}
      DELETE consumed
    `);
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
