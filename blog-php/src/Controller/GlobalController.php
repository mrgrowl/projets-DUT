<?php

namespace App\Controller;

use App\Repository\CategoryRepository;
use App\Repository\CommentRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class GlobalController extends AbstractController
{
    /**
     * @Route("/informations", name="info")
     */
    public function info()
    {
        return $this->render('member/about.html.twig');
    }

    public function sideBar(CommentRepository $comRepo, CategoryRepository $categRepo): Response
    {
        return $this->render('member/sidebar.html.twig', [
            'comments' => $comRepo->getLastComment(),
            'categories' => $categRepo->getUseCategories()
        ]);
    }
}
