<?php

namespace App\Repository;

use App\Entity\Post;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method Post|null find($id, $lockMode = null, $lockVersion = null)
 * @method Post|null findOneBy(array $criteria, array $orderBy = null)
 * @method Post[]    findAll()
 * @method Post[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class PostRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Post::class);
    }

    /**Retourne 5 postes selon la pagination donnée */
    public function getPaginedPosts(int $page)
    {

        return $this->createQueryBuilder("p")
            ->where("p.publishedAt < :now")
            ->setParameter('now', new \DateTime('now'))
            ->orderBy("p.createAt", "desc")
            ->setFirstResult(($page - 1) * 5)
            ->setMaxResults(5)
            ->getQuery()
            ->getResult();
    }

    /**
     * Retourne le nb total de posts
     */
    public function countPost()
    {
        return $this->createQueryBuilder("p")
            ->select("COUNT(p.id)")
            ->where("p.publishedAt < :now")
            ->setParameter('now', new \DateTime('now'))
            ->getQuery()
            ->getSingleScalarResult();
    }

    // /**
    //  * @return Post[] Returns an array of Post objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('p')
            ->andWhere('p.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('p.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?Post
    {
        return $this->createQueryBuilder('p')
            ->andWhere('p.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
