#!/bin/bash

echo "Starting project creation script..."

# --- Configuration: Define Parameters and Default Values ---
APP_NAME_DEFAULT="Leão Pet Vitality"
APP_TITLE_DEFAULT="Leão Pet Vitality - Nutrição e Cuidado para seu Pet"
APP_DESCRIPTION_DEFAULT="Descubra a melhor nutrição e suplementos para a vitalidade e saúde do seu pet. Produtos naturais e eficazes."
APP_AUTHOR_DEFAULT="Leão Pet Vitality"
FAVICON_URL_DEFAULT="/favicon.svg"
OG_IMAGE_URL_DEFAULT="/og-image.png"

HERO_BADGE_TEXT_DEFAULT="Aprovado pelo MAPA"
HERO_TITLE_PREFIX_DEFAULT="O Único Extrato de"
HERO_TITLE_HIGHLIGHT_DEFAULT="Juba de Leão"
HERO_TITLE_SUFFIX_DEFAULT="para Pets Aprovado pelo MAPA"
HERO_DESCRIPTION_DEFAULT="Mais saúde, bem-estar e vitalidade para cães e gatos. Reforce a imunidade, melhore a cognição e contribua para a saúde geral do seu pet com segurança comprovada."
HERO_CTA_PRIMARY_TEXT_DEFAULT="Comprar Agora – Frete Grátis"
HERO_CTA_SECONDARY_TEXT_DEFAULT="Saiba Mais"

# For Supabase and other sensitive keys, it's better to prompt without showing a default if they are truly secret.
# For this example, I'll use placeholders indicating where they should go in the .env file.
SUPABASE_URL_PLACEHOLDER="YOUR_SUPABASE_URL"
SUPABASE_ANON_KEY_PLACEHOLDER="YOUR_SUPABASE_ANON_KEY"
STRIPE_PUBLISHABLE_KEY_PLACEHOLDER="YOUR_STRIPE_PUBLISHABLE_KEY"
STRIPE_SECRET_KEY_PLACEHOLDER="YOUR_STRIPE_SECRET_KEY"


# --- Helper Functions ---
prompt_user() {
  local prompt_message=$1
  local default_value=$2
  local var_name=$3
  local user_input
  read -p "$prompt_message [${default_value}]: " user_input
  eval "$var_name=\"${user_input:-$default_value}\""
}

# --- Gather User Input ---
echo "Please provide the details for your new project."

prompt_user "Enter Project Directory Name" "my-new-app" PROJECT_DIR_NAME
prompt_user "Enter App Name" "$APP_NAME_DEFAULT" APP_NAME
prompt_user "Enter App Title (for HTML title tag)" "$APP_TITLE_DEFAULT" APP_TITLE
prompt_user "Enter App Description (for meta description)" "$APP_DESCRIPTION_DEFAULT" APP_DESCRIPTION
prompt_user "Enter App Author" "$APP_AUTHOR_DEFAULT" APP_AUTHOR
prompt_user "Enter Favicon URL" "$FAVICON_URL_DEFAULT" FAVICON_URL
prompt_user "Enter Open Graph Image URL" "$OG_IMAGE_URL_DEFAULT" OG_IMAGE_URL

prompt_user "Enter Hero Section Badge Text" "$HERO_BADGE_TEXT_DEFAULT" HERO_BADGE_TEXT
prompt_user "Enter Hero Section Title Prefix" "$HERO_TITLE_PREFIX_DEFAULT" HERO_TITLE_PREFIX
prompt_user "Enter Hero Section Title Highlight" "$HERO_TITLE_HIGHLIGHT_DEFAULT" HERO_TITLE_HIGHLIGHT
prompt_user "Enter Hero Section Title Suffix" "$HERO_TITLE_SUFFIX_DEFAULT" HERO_TITLE_SUFFIX
prompt_user "Enter Hero Section Description" "$HERO_DESCRIPTION_DEFAULT" HERO_DESCRIPTION
prompt_user "Enter Hero Section Primary CTA Text" "$HERO_CTA_PRIMARY_TEXT_DEFAULT" HERO_CTA_PRIMARY_TEXT
prompt_user "Enter Hero Section Secondary CTA Text" "$HERO_CTA_SECONDARY_TEXT_DEFAULT" HERO_CTA_SECONDARY_TEXT

read -p "Enter your Supabase Project URL: " SUPABASE_URL_INPUT
SUPABASE_URL="${SUPABASE_URL_INPUT}"
read -p "Enter your Supabase Anon Key: " SUPABASE_ANON_KEY_INPUT
SUPABASE_ANON_KEY="${SUPABASE_ANON_KEY_INPUT}"
read -p "Enter your Stripe Publishable Key (optional): " STRIPE_PUBLISHABLE_KEY_INPUT
STRIPE_PUBLISHABLE_KEY="${STRIPE_PUBLISHABLE_KEY_INPUT}"
read -p "Enter your Stripe Secret Key (optional, for backend): " STRIPE_SECRET_KEY_INPUT
STRIPE_SECRET_KEY="${STRIPE_SECRET_KEY_INPUT}"


# --- Create Project Structure ---
echo "Creating project directory: $PROJECT_DIR_NAME"
if [ -d "$PROJECT_DIR_NAME" ]; then
  echo "Error: Directory '$PROJECT_DIR_NAME' already exists."
  exit 1
fi
mkdir -p "$PROJECT_DIR_NAME"

echo "Copying template files..."
# Create the template directory if it doesn't exist (for local testing of the script)
mkdir -p template
# This assumes the script is run from the root of the original project,
# and 'template/' directory will be created and populated in next steps.
# For now, we'll simulate by copying from the current project structure.
# In a real scenario, 'template/' would be pre-populated.

# Copy all files and directories, including hidden ones.
cp -a . "$PROJECT_DIR_NAME/"

# Remove files and directories that should not be part of the template output
rm -rf "$PROJECT_DIR_NAME/template" # Don't copy the template folder itself
rm -f "$PROJECT_DIR_NAME/create_project.sh" # Don't copy the script itself
rm -rf "$PROJECT_DIR_NAME/.git" # Don't copy the .git history of the template repo
# Add any other files/dirs to exclude, e.g. node_modules if they were accidentally copied

# --- Replace Placeholders ---
echo "Customizing files..."
# List of files to process for placeholder replacement
# We target specific files known to contain these placeholders.
# Using 'find' can be broad; for now, let's specify key files.

TARGET_FILES=(
  "$PROJECT_DIR_NAME/index.html"
  "$PROJECT_DIR_NAME/src/components/HeroSection.tsx"
  # Add other files that will contain placeholders
)

# Ensure .env.example exists before trying to copy and modify it
if [ -f "$PROJECT_DIR_NAME/.env.example" ]; then
  echo "Creating .env file from .env.example"
  cp "$PROJECT_DIR_NAME/.env.example" "$PROJECT_DIR_NAME/.env"
  TARGET_FILES+=("$PROJECT_DIR_NAME/.env")
else
  echo "Warning: .env.example not found. Skipping .env creation."
fi


for file_path in "${TARGET_FILES[@]}"; do
  if [ -f "$file_path" ]; then
    echo "Processing $file_path..."
    # Use a temporary file for sed to avoid issues with -i on different systems
    tmp_file=$(mktemp)

    # Ensure variables are properly escaped for sed if they contain special characters.
    # For simplicity, this example assumes they don't contain sed special chars like /, &, \
    # A more robust script would escape these.

    sed -e "s|{{APP_NAME}}|$APP_NAME|g" \
        -e "s|{{APP_TITLE}}|$APP_TITLE|g" \
        -e "s|{{APP_DESCRIPTION}}|$APP_DESCRIPTION|g" \
        -e "s|{{APP_AUTHOR}}|$APP_AUTHOR|g" \
        -e "s|{{FAVICON_URL}}|$FAVICON_URL|g" \
        -e "s|{{OG_IMAGE_URL}}|$OG_IMAGE_URL|g" \
        -e "s|{{HERO_BADGE_TEXT}}|$HERO_BADGE_TEXT|g" \
        -e "s|{{HERO_TITLE_PREFIX}}|$HERO_TITLE_PREFIX|g" \
        -e "s|{{HERO_TITLE_HIGHLIGHT}}|$HERO_TITLE_HIGHLIGHT|g" \
        -e "s|{{HERO_TITLE_SUFFIX}}|$HERO_TITLE_SUFFIX|g" \
        -e "s|{{HERO_DESCRIPTION}}|$HERO_DESCRIPTION|g" \
        -e "s|{{HERO_CTA_PRIMARY_TEXT}}|$HERO_CTA_PRIMARY_TEXT|g" \
        -e "s|{{HERO_CTA_SECONDARY_TEXT}}|$HERO_CTA_SECONDARY_TEXT|g" \
        -e "s|VITE_SUPABASE_URL=$SUPABASE_URL_PLACEHOLDER|VITE_SUPABASE_URL=$SUPABASE_URL|g" \
        -e "s|VITE_SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY_PLACEHOLDER|VITE_SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY|g" \
        -e "s|VITE_STRIPE_PUBLISHABLE_KEY=$STRIPE_PUBLISHABLE_KEY_PLACEHOLDER|VITE_STRIPE_PUBLISHABLE_KEY=$STRIPE_PUBLISHABLE_KEY|g" \
        -e "s|STRIPE_SECRET_KEY=$STRIPE_SECRET_KEY_PLACEHOLDER|STRIPE_SECRET_KEY=$STRIPE_SECRET_KEY|g" \
        "$file_path" > "$tmp_file" && mv "$tmp_file" "$file_path"
  else
    echo "Warning: File $file_path not found for placeholder replacement."
  fi
done

# Placeholder for Supabase client initialization
# This would typically be in a file like src/lib/supabase.ts or src/integrations/supabase/client.ts
# For now, the .env replacement handles VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
# The application code should already be using these environment variables.
# If direct replacement in JS/TS files is needed, add that file to TARGET_FILES and use sed.

# --- Final Steps ---
echo "Project '$PROJECT_DIR_NAME' created successfully!"
echo "To get started:"
echo "1. cd $PROJECT_DIR_NAME"
echo "2. (If not already done by the script) Review and complete the .env file with your API keys."
echo "3. npm install (or bun install, yarn install)"
echo "4. npm run dev (or bun dev, yarn dev)"

read -p "Initialize a new Git repository in the project? (y/n): " init_git
if [[ "$init_git" == "y" || "$init_git" == "Y" ]]; then
  (cd "$PROJECT_DIR_NAME" && git init && git add . && git commit -m "Initial commit from template")
  echo "Git repository initialized."
fi

echo "Done."
