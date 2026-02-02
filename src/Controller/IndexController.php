<?php

namespace App\Controller;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Core\Security;

final class IndexController extends AbstractController
{
    #[Route('/', name: 'index')]
    public function index(): Response
    {
        return $this->render('Pages/index.html.twig', [
            'controller_name' => 'IndexController',
        ]);
    }

    #[Route('/contact', name: 'contact')]
    public function contact(): Response
    {
        return $this->render('Pages/contact.html.twig', [
            'controller_name' => 'IndexController',
        ]);
    }

    #[Route('/formation', name: 'formation')]
    public function formation(): Response
    {
        return $this->render('Pages/formations.html.twig', [
            'controller_name' => 'IndexController',
        ]);
    }

    #[Route('/jeu', name: 'jeu')]
    public function jeu(Security $security): Response
    {
        $user = $security->getUser();

        $bestScore = $user ? $user->getBestScore() : null;

        return $this->render('Pages/jeu.html.twig', [
            'bScore' => $bestScore,
        ]);
    }

    #[Route('/presentation', name: 'presentation')]
    public function presentation(): Response
    {
        return $this->render('Pages/presentation.html.twig', [
            'controller_name' => 'IndexController',
        ]);
    }

    #[Route('/valeur', name: 'valeur')]
    public function valeur(): Response
    {

        return $this->render('Pages/valeurs.html.twig', []);
    }

    #[Route('/jeuscore', name: 'jeu_save', methods: ['POST'])]
    public function saveScore(Security $security, Request $request, EntityManagerInterface $em): JsonResponse 
    {
        
        $user = $security->getUser();

        if (!$user) {
            return new JsonResponse(['error' => 'Utilisateur non connecté'], 401);
        }

        $data = json_decode($request->getContent(), true);

        if (!isset($data['moves'])) {
            return new JsonResponse(['error' => 'Moves manquant'], 400);
        }

        $moves = (int) $data['moves'];

        $bestScore = $user->getBestscore();

        // Si aucun score encore enregistré OU meilleur score
        if ($bestScore === null || $moves < $bestScore) {
            $user->setBestscore($moves);
            $em->flush();
        }

        return new JsonResponse([
            'success' => true,
            'bestScore' => $user->getBestscore()
        ]);
    }

}
