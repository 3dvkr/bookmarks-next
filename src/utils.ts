import { sql } from 'drizzle-orm'
import { db } from './db'
import { RowList } from 'postgres'

export interface ClassVotes {
  link: string,
  likes: string,
  dislikes: string
}
type votes = RowList<Record<string, ClassVotes>[]>

const cache: Record<string, votes> = {}

export const getVotedResources = async (classNum: string) => {
  if (cache.hasOwnProperty(classNum)) {
    return cache[classNum]
  }
  // TODO: replace hard-coded course_id with the one from user's data
	const votedResources: votes = await db.execute(
		sql`SELECT     
    r.link,
    r.name,
    r.format,
    COUNT(CASE WHEN v.is_liked THEN 1 END) AS likes,
    COUNT(CASE WHEN NOT v.is_liked THEN 1 END) AS dislikes 
    FROM votes v 
    JOIN resources r 
    ON v.resource_id = r.id
    AND v.class_id = (SELECT id FROM classes WHERE classes.class_number = ${classNum} AND classes.course_id = ${1} )
    GROUP BY
    r.link,
    r.name,
    r.format;`
	)
  cache[classNum] = votedResources
	return votedResources
}
