<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class QuizzController extends AbstractController
{
    #[Route('/quizz', name: 'app_quizz')]
    public function index(Request $request): Response
    {
        $quizznumber = $request->get('number', 0);
        $answerIndex = $request->get('answer'); // Index de la réponse choisie

        // Définis les questions
        $questions = [
            0 => [
                'question' => 'En quelle année la Première République française a-t-elle été proclamée ?',
                'answers' => ['1789', '1792', '1804', '1848'],
                'correct' => 1
            ],
            1 => [
                'question' => 'Quelle est la devise de la République française ?',
                'answers' => ['Unité, Force, Progrès', 'Liberté, Égalité, Fraternité', 'Honneur, Patrie, Devoir', 'Paix, Justice, Liberté'],
                'correct' => 1
            ],
            2 => [
                'question' => 'Quel est le symbole féminin de la République française ?',
                'answers' => ['Jeanne d\'Arc', 'La Semeuse', 'Marianne', 'La Parisienne'],
                'correct' => 2
            ],
            3 => [
                'question' => 'Sous quelle République vivons-nous actuellement en France ?',
                'answers' => ['IVe République', 'Ve République', 'VIe République', 'IIIe République'],
                'correct' => 1
            ],
            4 => [
                'question' => 'Qui a fondé la Ve République en 1958 ?',
                'answers' => ['François Mitterrand', 'Georges Pompidou', 'Charles de Gaulle', 'René Coty'],
                'correct' => 2
            ],
            5 => [
                'question' => 'Quel est l\'hymne national de la République française ?',
                'answers' => ['Le Chant du Départ', 'La Marseillaise', 'La Parisienne', 'L\'Internationale'],
                'correct' => 1
            ],
            6 => [
                'question' => 'Quel article de la Constitution définit la France comme une "République indivisible, laïque, démocratique et sociale" ?',
                'answers' => ['Article 1er', 'Article 2', 'Article 5', 'Article 16'],
                'correct' => 0
            ],
            7 => [
                'question' => 'Quel président a mis fin à la IVe République ?',
                'answers' => ['Vincent Auriol', 'René Coty', 'Charles de Gaulle', 'Paul Reynaud'],
                'correct' => 2
            ],
            8 => [
                'question' => 'Quelle couleur ne figure PAS sur le drapeau de la République française ?',
                'answers' => ['Bleu', 'Blanc', 'Rouge', 'Vert'],
                'correct' => 3
            ],
            9 => [
                'question' => 'Quel jour est la fête nationale de la République française ?',
                'answers' => ['8 mai', '11 novembre', '14 juillet', '1er mai'],
                'correct' => 2
            ]
        ];

        // Vérifie si la réponse précédente était correcte
        $previousQuestion = $request->get('previous');
        if ($previousQuestion !== null && $answerIndex !== null) {
            if (isset($questions[$previousQuestion]) 
                && $questions[$previousQuestion]['correct'] == $answerIndex) {
                // Bonne réponse : on passe à la question suivante
                $quizznumber = $previousQuestion + 1;
            } else {
                // Mauvaise réponse : on reste sur la même question
                $quizznumber = $previousQuestion;
            }
        }

        if (isset($questions[$quizznumber])) {
            $question = $questions[$quizznumber]['question'];
            $answers = $questions[$quizznumber]['answers'];
        } else {
            $question = "Quiz terminé !";
            $answers = [];
        }
        
        return $this->render('Pages/questionnaire.html.twig', [
            'quizznumber' => $quizznumber,
            'question' => $question,
            'answers' => $answers,
        ]);
    }
}
