/**
 * External dependencies
 */
import { test, expect } from '@woocommerce/e2e-playwright-utils';

const permalink = '/product-category/clothing';
const templateName = 'Products by Category';
const templatePath = 'woocommerce/woocommerce//taxonomy-product_cat';
const templateType = 'wp_template';

test.describe( 'Products by Category template', async () => {
	test( 'can be modified and reverted', async ( {
		admin,
		editorUtils,
		page,
	} ) => {
		// Verify the template can be edited.
		await admin.visitSiteEditor( {
			postId: templatePath,
			postType: templateType,
		} );
		await editorUtils.enterEditMode();
		await editorUtils.closeWelcomeGuideModal();
		await editorUtils.editor.insertBlock( {
			name: 'core/paragraph',
			attributes: { content: 'Hello World in the template' },
		} );
		await editorUtils.saveTemplate();
		await page.goto( permalink );
		await expect(
			page.getByText( 'Hello World in the template' ).first()
		).toBeVisible();

		// Verify the edition can be reverted.
		await admin.visitAdminPage(
			'site-editor.php',
			`path=/${ templateType }/all`
		);
		await editorUtils.revertTemplateCustomizations( templateName );
		await page.goto( permalink );
		await expect(
			page.getByText( 'Hello World in the template' )
		).toHaveCount( 0 );
	} );

	test( 'defaults to the Product Catalog template', async ( {
		admin,
		editorUtils,
		page,
	} ) => {
		// Edit Product Catalog template and verify changes are visible.
		await admin.visitSiteEditor( {
			postId: 'woocommerce/woocommerce//archive-product',
			postType: 'wp_template',
		} );
		await editorUtils.enterEditMode();
		await editorUtils.closeWelcomeGuideModal();
		await editorUtils.editor.insertBlock( {
			name: 'core/paragraph',
			attributes: {
				content: 'Hello World in the Product Catalog template',
			},
		} );
		await editorUtils.saveTemplate();
		await page.goto( permalink );
		await expect(
			page
				.getByText( 'Hello World in the Product Catalog template' )
				.first()
		).toBeVisible();

		// Verify the edition can be reverted.
		await admin.visitAdminPage(
			'site-editor.php',
			`path=/wp_template/all`
		);
		await editorUtils.revertTemplateCustomizations( 'Product Catalog' );
		await page.goto( permalink );
		await expect(
			page.getByText( 'Hello World in the Product Catalog template' )
		).toHaveCount( 0 );
	} );
} );