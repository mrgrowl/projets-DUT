<?php

namespace App\Controller;

use App\Entity\Post;
use App\Form\PostType;
use App\Repository\CommentRepository;
use App\Repository\PostRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\String\Slugger\AsciiSlugger;


class AdminPostController extends AbstractController
{
    /**
     * @Route("/admin/posts", name="post_index")
     * @Route("/admin", name="admin_index")
     */
    public function index(PostRepository $postRepository): Response
    {
        return $this->render('admin/post/index.html.twig', [
            'posts' => $postRepository->findAll(),
        ]);
    }


    /**
     * @Route("/admin/posts/new", name="post_new", methods={"GET","POST"})
     */
    public function new(Request $request): Response
    {

        $post = new Post();
        $post->setCreateAt(new \DateTime('now'));
        $post->setPublishedAt(new \DateTime('now'));
        $form = $this->createForm(PostType::class, $post);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $entityManager = $this->getDoctrine()->getManager();

            $sluggger = new AsciiSlugger();
            $slug = $sluggger->slug($post->getTitle());

            $post->setSlug($slug);

            $entityManager->persist($post);
            $entityManager->flush();

            $this->addFlash('success', "Le post ' " . $post->getTitle() . "' a bien été créé.");

            return $this->redirectToRoute('post_index');
        }

        return $this->render('admin/post/new.html.twig', [
            'post' => $post,
            'form' => $form->createView(),
        ]);
    }

    /**
     * @Route("/admin/posts/{slug}", name="post_show", methods={"GET"})
     */
    public function show(Post $post, CommentRepository $comRepo): Response
    {


        return $this->render('admin/post/show.html.twig', [
            'post' => $post,
            'categories' => $post->getCategories(),
            'comments' => $comRepo->getCommentByPost($post)
        ]);
    }


    /**
     * @Route("/admin/posts/{id}/edit", name="post_edit", methods={"GET","POST"})
     */
    public function edit(Request $request, Post $post): Response
    {
        $form = $this->createForm(PostType::class, $post);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $post->setUpdatedAt(new \DateTime('now'));
            $this->getDoctrine()->getManager()->flush();

            $this->addFlash('success', "Le post ' " . $post->getTitle() . "' a bien été modifié.");

            return $this->redirectToRoute('post_index');
        }

        return $this->render('admin/post/edit.html.twig', [
            'post' => $post,
            'form' => $form->createView(),
        ]);
    }

    /**
     * @Route("/admin/{id}", name="post_delete", methods={"POST"})
     */
    public function delete(Request $request, Post $post): Response
    {
        if ($this->isCsrfTokenValid('delete' . $post->getId(), $request->request->get('_token'))) {
            $entityManager = $this->getDoctrine()->getManager();
            $entityManager->remove($post);
            $entityManager->flush();
        }

        return $this->redirectToRoute('post_index');
    }
}
