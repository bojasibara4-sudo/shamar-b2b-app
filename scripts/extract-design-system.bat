@echo off
echo ========================================
echo Extraction Design System - Chamar
echo ========================================
echo.

REM Vérifier si Python est installé
python --version >nul 2>&1
if errorlevel 1 (
    echo ERREUR: Python n'est pas installe
    echo Installez Python depuis https://www.python.org/
    pause
    exit /b 1
)

REM Vérifier si les dépendances sont installées
python -c "import PIL" >nul 2>&1
if errorlevel 1 (
    echo Installation des dependances...
    pip install -r requirements-design-system.txt
    if errorlevel 1 (
        echo ERREUR: Echec de l'installation des dependances
        pause
        exit /b 1
    )
)

REM Exécuter le script
echo.
echo Execution de l'analyse...
echo.
python extract-design-system.py

if errorlevel 1 (
    echo.
    echo ERREUR lors de l'execution
    pause
    exit /b 1
)

echo.
echo ========================================
echo Analyse terminee avec succes!
echo ========================================
pause
