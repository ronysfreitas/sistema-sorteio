<?php

/**
 * Arquivo com configurações globais do sistema
 */
date_default_timezone_set('America/Sao_Paulo');

define("RAIZ_MANAGER", dirname(__FILE__) . "/");

define("KEY", "chess");


/**
 * Incluindo diretivas de importaÃ§Ã£o de classes a partir do diretorio especifico
 */
spl_autoload_extensions('.php');

/**
 * Criando o array de nomes de pastas para olhar se exites as classes dentro.
 *
 * OBS: Criando o array fora da função classLoader() para não
 * carregar isso toda vez que uma classe for inclusa.
 *
 * $dirClasses contem todos os diretorios dentro da pasta 'classes/' incluindo esta.
 */
$dirClasses = array('classes');

/**
 * Função que auto-carrega as classes
 * @param type $class
 * @return boolean
 */
function classLoader($class) {
    $filename = $class . '.php';
    global $dirClasses;
    foreach ($dirClasses as $pasta) {
        if (file_exists(RAIZ_MANAGER . $pasta . "/" . $filename)) {
            include (RAIZ_MANAGER . $pasta . "/" . $filename);
            break;
        }
    }
    return false;
}

/**
 * Registrando função de auto-carregamento
 */
spl_autoload_register('classLoader');