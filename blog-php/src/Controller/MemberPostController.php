<?php

namespace App\Controller;

use App\Entity\Post;
use App\Entity\Comment;
use App\Form\CommentType;
use App\Repository\CommentRepository;
use App\Repository\PostRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;


class MemberPostController extends AbstractController
{

    /**
     * @Route("/",name="user_index")
     */
    public function index_member(PostRepository $postRepository, Request $request): Response
    {
        return $this->render('member/index.html.twig', [
            'posts' => $postRepository->getPaginedPosts((int) $request->query->get("page", 1)),
            'totalPosts' => $postRepository->countPost(),
            'page' => $request->query->get("page", 1)
        ]);
    }

    /**
     * @Route("/post/{slug}", name="user_show_post", methods={"GET","POST"})
     */
    public function user_show(Post $post, Request $request, CommentRepository $comRepo): Response
    {
        $validForm = false;
        $comment = new Comment();

        $form = $this->createForm(CommentType::class, $comment);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $validForm = true;
            $entityManager = $this->getDoctrine()->getManager();
            $comment->setPost($post);
            $comment->setValid(false);
            $comment->setCreatedAt(new \DateTime('now'));

            $entityManager->persist($comment);
            $entityManager->flush();
        }

        return $this->render('member/show.html.twig', [
            'post' => $post,
            'categories' => $post->getCategories(),
            'form' => $form->createView(),
            'comments' => $comRepo->getCommentByPost($post),
            'validForm' => $validForm
        ]);
    }
}
