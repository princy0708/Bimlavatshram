-- Enable admins to view all orders, bypassing the standard user restriction
CREATE POLICY "Admins can view all orders" ON public.orders
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  );

-- Enable admins to update order statuses
CREATE POLICY "Admins can update orders" ON public.orders
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  );
